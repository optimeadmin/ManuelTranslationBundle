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

use ManuelAguirre\Bundle\TranslationBundle\TranslationRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\Config\Resource\FileResource;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Translation\Exception\InvalidResourceException;
use Symfony\Component\Translation\Exception\NotFoundResourceException;
use Symfony\Component\Translation\Loader\LoaderInterface;
use Symfony\Component\Translation\MessageCatalogue;


/**
 * @autor Manuel Aguirre <programador.manuel@gmail.com>
 */
class DoctrineLoader implements LoaderInterface
{
    /**
     * @var TranslationRepository
     */
    protected $translationRepository;
    /**
     * @var TranslationRepository
     */
    protected $backupTranslationRepository;
    /**
     * @var Filesystem
     */
    private $filesystem;
    /**
     * @var string
     */
    private $cacheDir;
    /**
     * @var LoggerInterface|null
     */
    protected $logger = null;

    public function __construct(
        TranslationRepository $translationRepository,
        TranslationRepository $backupTranslationRepository,
        Filesystem $filesystem,
        string $cacheDir,
        ?LoggerInterface $logger = null
    ) {
        $this->translationRepository = $translationRepository;
        $this->backupTranslationRepository = $backupTranslationRepository;
        $this->filesystem = $filesystem;
        $this->cacheDir = $cacheDir;
        $this->logger = $logger;
    }

    /**
     * Loads a locale.
     *
     * @param mixed $resource A resource
     * @param string $locale A locale
     * @param string $domain The domain
     *
     * @return MessageCatalogue A MessageCatalogue instance
     *
     * @throws NotFoundResourceException when the resource cannot be found
     * @throws InvalidResourceException  when the resource cannot be loaded
     * @api
     *
     */
    public function load($resource, $locale, $domain = 'messages')
    {
        $catalogue = new MessageCatalogue($locale);
        $catalogue->addResource(new FileResource($resource));

        if (!$this->isLoadedFromBackup()) {
            $translations = $this->loadFromBackup();
        } else {
            try {
                $translations = $this->translationRepository->getActiveTranslations();
            } catch (\Throwable $e) {
                if ($this->logger) {
                    $this->logger->warning('No se pudo obtener las traducciones desde la base de datos', [
                        'error' => $e->getMessage(),
                        'error_type' => get_class($e),
                    ]);
                }

                $translations = $this->loadFromBackup();
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

    private function isLoadedFromBackup(): bool
    {
        return $this->filesystem->exists($this->getLoadedBackupFilename());
    }

    private function loadFromBackup(): array
    {
        try {
            $this->filesystem->dumpFile($this->getLoadedBackupFilename(), date('Y-m-d H:i:s'));
            if ($this->logger) {
                $this->logger->debug('Intentando cargar las traducciones desde el backup de traducciones');
            }

            return $this->backupTranslationRepository->getActiveTranslations();
        } catch (\Throwable $e) {
            if ($this->logger) {
                $this->logger->warning('No se pudo obtener las traducciones desde el backup', [
                    'error' => $e->getMessage(),
                    'error_type' => get_class($e),
                ]);
            }

            return [];
        }
    }

    private function getLoadedBackupFilename(): string
    {
        return $this->cacheDir.'/__translations_loaded_from_backup';
    }
}
