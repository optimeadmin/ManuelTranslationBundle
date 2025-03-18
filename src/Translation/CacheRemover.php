<?php
/**
 * Date: 27/07/2018
 * Time: 4:18 PM
 */

namespace ManuelAguirre\Bundle\TranslationBundle\Translation;

use ManuelAguirre\Bundle\TranslationBundle\Event\CacheRemovedEvent;
use Psr\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Filesystem\Exception\IOException;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Class CacheRemover
 *
 * @author Manuel Aguirre maguirre@optimeconsulting.com
 */
class CacheRemover
{

    public function __construct(
        private readonly Filesystem $filesystem,
        private readonly EventDispatcherInterface $eventDispatcher,
        private readonly string $cacheDir,
    ) {
    }

    public function clear(): ?bool
    {
        $path = $this->getPath();

        if (!$this->filesystem->exists($path)) {
            return null;
        }

        try {
            $this->filesystem->remove($path);

            $this->eventDispatcher->dispatch(new CacheRemovedEvent());
        } catch (IOException $ex) {
            // no hacer nada
            return false;
        }

        return true;
    }

    private function getPath(): string
    {
        return rtrim($this->cacheDir, '/').'/translations/';
    }
}