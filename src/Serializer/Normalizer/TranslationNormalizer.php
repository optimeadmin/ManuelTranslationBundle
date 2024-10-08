<?php
/*
 * This file is part of the Manuel Aguirre Project.
 *
 * (c) Manuel Aguirre <programador.manuel@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace ManuelAguirre\Bundle\TranslationBundle\Serializer\Normalizer;

use ManuelAguirre\Bundle\TranslationBundle\Entity\Translation;
use ManuelAguirre\Bundle\TranslationBundle\Model\TranslationLastEdit;
use Symfony\Component\PropertyAccess\PropertyAccessorInterface;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ContextAwareNormalizerInterface;
use function dump;

/**
 * @author Manuel Aguirre <programador.manuel@gmail.com>
 */
class TranslationNormalizer implements ContextAwareNormalizerInterface, ContextAwareDenormalizerInterface
{
    public function __construct(
        private PropertyAccessorInterface $propertyAccessor
    ) {
    }

    public function normalize(mixed $object, string $format = null, array $context = [])
    {
        return [
            'id' => $object->getId(),
            'active' => $object->getActive(),
            'code' => $object->getCode(),
            'domain' => $object->getDomain(),
            'frontendDomains' => $object->getFrontendDomains(),
            'onlyFrontend' => $object->isOnlyFrontend(),
            'values' => $object->getValues(),
            'createdAt' => $object->getCreatedAt(),
            'lastChanged' => $object->getLastChanged(),
            'updatedAt' => $object->getUpdatedAt(),
        ];
    }

    public function denormalize(mixed $data, string $type, string $format = null, array $context = [])
    {
        if (isset($context['object_to_populate'])) {
            /** @var Translation $translation */
            $translation = $context['object_to_populate'];
        } else {
            $translation = new Translation(
                $data['code'] ?? '',
                $data['domain'] ?? '',
            );
        }

        unset(
            $data['createdAt'],
            $data['updatedAt'],
            $data['id'],
            $data['hash'],
            $data['uuid'],
        );

        if (isset($data['lastChanged'])) {
            $data['lastChanged'] = TranslationLastEdit::from($data['lastChanged']);
        }

        foreach ($data as $key => $value) {
            $this->propertyAccessor->setValue($translation, $key, $value);
        }

        return $translation;
    }

    public function supportsNormalization(mixed $data, string $format = null, array $context = []): bool
    {
        return $data instanceof Translation;
    }

    public function supportsDenormalization(mixed $data, string $type, string $format = null, array $context = []): bool
    {
        return $type == Translation::class;
    }
}