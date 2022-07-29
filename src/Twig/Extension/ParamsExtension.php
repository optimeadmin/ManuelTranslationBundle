<?php
/**
 * @author Manuel Aguirre
 */

namespace ManuelAguirre\Bundle\TranslationBundle\Twig\Extension;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * @author Manuel Aguirre
 */
class ParamsExtension extends AbstractExtension
{
    public function __construct(
        private array $params,
    ) {
    }

    public function getFunctions()
    {
        return [
            new TwigFunction(
                'get_translation_bundle_param',
                [$this, 'getParam']
            ),
        ];
    }

    public function getParam(string $name): mixed
    {
        return $this->params[$name] ?? null;
    }
}