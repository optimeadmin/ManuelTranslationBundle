<?php
/*
 * This file is part of the Manuel Aguirre Project.
 *
 * (c) Manuel Aguirre <programador.manuel@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace ManuelAguirre\Bundle\TranslationBundle\Translation\Loader;

use ManuelAguirre\Bundle\TranslationBundle\BackupTranslationRepository;
use ManuelAguirre\Bundle\TranslationBundle\TranslationRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\Config\Resource\FileResource;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Translation\Loader\LoaderInterface;
use Symfony\Component\Translation\MessageCatalogue;

/**
 * @autor Manuel Aguirre <programador.manuel@gmail.com>
 */
#[AutoconfigureTag("translation.loader", ['alias' => 'doctrine'])]
class DoctrineLoader implements LoaderInterface
{
    function __construct(
        private readonly TranslationRepository $translationRepository,
        private readonly BackupTranslationRepository $backupRepository,
        private readonly ?LoggerInterface $logger,
    ) {
    }

    public function load(mixed $resource, string $locale, string $domain = 'messages'): MessageCatalogue
    {
        $catalogue = new MessageCatalogue($locale);
        // Ya probé con directoryResource y falló porque llegó un archivo messages.en.doctrine.
        $catalogue->addResource(new FileResource($resource));

        try {
            $translations = $this->translationRepository->getActiveTranslations();
        } catch (\Throwable $e) {
            $this->logger?->warning('No se pudo obtener las traducciones desde la base de datos', [
                'error' => $e->getMessage(),
                'error_type' => get_class($e),
            ]);

            try {
                $this->logger?->warning('Intentando cargar las traducciones desde el backup de traducciones');

                $translations = $this->backupRepository->getActiveTranslations();
            } catch (\Throwable $e) {
                $this->logger?->warning('No se pudo obtener las traducciones desde el backup', [
                    'error' => $e->getMessage(),
                    'error_type' => get_class($e),
                ]);

                return $catalogue;
            }
        }

        foreach ($translations as $translation) {
            if (array_key_exists($locale, $translation['values'])) {
                $code = trim($translation['code']);
                $catalogue->set($code, $translation['values'][$locale], $translation['domain']);
            }
        }

        return $catalogue;
    }
}