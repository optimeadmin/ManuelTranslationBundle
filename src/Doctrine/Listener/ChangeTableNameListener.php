<?php
/**
 * @author Manuel Aguirre
 */

namespace ManuelAguirre\Bundle\TranslationBundle\Doctrine\Listener;

use Doctrine\ORM\Event\LoadClassMetadataEventArgs;
use Doctrine\ORM\Events;
use ManuelAguirre\Bundle\TranslationBundle\Entity\Translation;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

/**
 * @author Manuel Aguirre
 */
#[AsEventListener(event: Events::loadClassMetadata, method: 'loadClassMetadata')]
class ChangeTableNameListener
{
    public function __construct(private string $tablePrefix)
    {
        $this->tablePrefix = rtrim($tablePrefix, '_') . '_';
    }

    public function loadClassMetadata(LoadClassMetadataEventArgs $eventArgs): void
    {
        $metadata = $eventArgs->getClassMetadata();

        if ($metadata->getName() !== Translation::class) {
            return;
        }

        $metadata->setPrimaryTable([
            'name' => $this->tablePrefix . $metadata->getTableName()
        ]);
    }
}
