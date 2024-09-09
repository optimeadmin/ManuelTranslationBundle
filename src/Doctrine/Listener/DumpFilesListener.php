<?php
/*
 * This file is part of the Manuel Aguirre Project.
 *
 * (c) Manuel Aguirre <programador.manuel@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace ManuelAguirre\Bundle\TranslationBundle\Doctrine\Listener;

use ManuelAguirre\Bundle\TranslationBundle\Entity\Translation;
use ManuelAguirre\Bundle\TranslationBundle\Translation\Dumper\CataloguesDumper;
use Symfony\Component\DependencyInjection\Attribute\When;

/**
 * @author maguirre <maguirre@developerplace.com>
 */
#[When("dev")]
class DumpFilesListener
{
    /**
     * @internal
     */
    private bool $translationChanged = false;

    public function __construct(private CataloguesDumper $cataloguesDumper)
    {
    }

    public function postPersist($event): void
    {
        $this->onTranslationSaved($event);
    }

    public function postUpdate($event): void
    {
        $this->onTranslationSaved($event);
    }

    public function onTranslationSaved($event): void
    {
        if (method_exists($event, 'getObject')) {
            $entity = $event->getObject();
        } elseif (method_exists($event, 'getEntity')) {
            $entity = $event->getEntity();
        } else {
            return;
        }

        if ($entity instanceof Translation) {
            $this->translationChanged = true;
        }
    }

    public function postFlush(): void
    {
        if ($this->translationChanged) {
            $this->cataloguesDumper->dump();

            $this->translationChanged = false;
        }
    }
}