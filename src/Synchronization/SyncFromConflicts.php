<?php
/**
 * @author Manuel Aguirre
 */

declare(strict_types=1);

namespace ManuelAguirre\Bundle\TranslationBundle\Synchronization;

use Doctrine\ORM\EntityManagerInterface;
use ManuelAguirre\Bundle\TranslationBundle\Entity\Translation;
use ManuelAguirre\Bundle\TranslationBundle\Entity\TranslationRepository;
use ManuelAguirre\Bundle\TranslationBundle\Model\TranslationLastEdit;

/**
 * @author Manuel Aguirre
 */
class SyncFromConflicts
{
    public function __construct(
        private Synchronizer $synchronizer,
        private TranslationRepository $translationRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function processFromRequest(array $requestData, bool $finished): void
    {
        foreach ($requestData as $itemData) {
            if (!$translation = $this->translationRepository->find($itemData['id'])) {
                continue;
            }

            $this->processItem($translation, $itemData);
        }

        $this->entityManager->flush();

        if ($finished) {
            $this->synchronizer->markSyncAsDone();
        }
    }

    private function processItem(Translation $translation, array $data): void
    {
        $values = $data['values'] ?? [];
        $frontendDomains = $data['frontendDomains'] ?? [];
        $onlyFrontend = $data['onlyFrontend'] ?? false;
        $active = (bool)$data['active'];
        $lastChanged = TranslationLastEdit::from($data['applyFor']);
        $hash = $lastChanged === TranslationLastEdit::FILE ? ($data['hash'] ?? '') : $translation->getHash();

        $this->synchronizer->updateTranslation(
            $translation,
            $values,
            $frontendDomains,
            $onlyFrontend,
            $hash,
            $active,
            $lastChanged,
        );
    }
}