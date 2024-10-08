<?php
/*
 * This file is part of the Manuel Aguirre Project.
 *
 * (c) Manuel Aguirre <programador.manuel@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace ManuelAguirre\Bundle\TranslationBundle\Controller;

use ManuelAguirre\Bundle\TranslationBundle\Entity\Translation;
use ManuelAguirre\Bundle\TranslationBundle\Entity\TranslationRepository;
use ManuelAguirre\Bundle\TranslationBundle\Synchronization\Synchronizer;
use ManuelAguirre\Bundle\TranslationBundle\Translation\CacheRemover;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @author Manuel Aguirre <programador.manuel@gmail.com>
 */
#[IsGranted('manage_translations')]
class TranslationController extends AbstractController
{
    public function __construct(private ParameterBagInterface $parameters)
    {
    }

    #[Route("/list/", name: "manuel_translation_list")]
    public function index(TranslationRepository $repository): Response
    {
        return $this->render('@ManuelTranslation/Default/index.html.twig', array(
            'locales' => $this->parameters->get('manuel_translation.locales'),
            'domains' => $repository->getExistentDomains(),
            'frontend_domains' => $repository->getExistentFrontendDomains(),
        ));
    }

    #[Route("/list/react/", name: "manuel_translations_list_react")]
    public function renderReact(TranslationRepository $repository): Response
    {
        return $this->render('@ManuelTranslation/Default/_react.html.twig', array(
            'locales' => $this->parameters->get('manuel_translation.locales'),
            'domains' => $repository->getExistentDomains(),
            'frontend_domains' => $repository->getExistentFrontendDomains(),
        ));
    }

    #[Route("/download.php", name: "manuel_translation_download_backup_file")]
    public function liveDownloadBackup(
        Synchronizer $synchronizator,
        TranslatorInterface $translator
    ): Response {
        $path = $this->getParameter('kernel.cache_dir') . '/sf_translations.php';

        if (!$synchronizator->generateFile($path, true)) {
            $this->addFlash('warning',
                $translator->trans('local_hash_update_of_range', array(), 'ManuelTranslationBundle'));

            return $this->redirectToRoute('manuel_translation_list');
        }

        $response = new BinaryFileResponse($path);
        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT);

        return $response;
    }

    #[Route("/clear-cache", name: "manuel_translation_clear_cache")]
    public function clearCache(
        CacheRemover $cacheRemover
    ): Response {
        if (false !== $cacheRemover->clear()) {
            $this->addFlash('success', 'Caché limpiada con éxito');
        } else {
            $this->addFlash('warning', 'No se pudo limpiar la caché de traducciones');
        }

        return $this->redirectToRoute('manuel_translation_list');
    }
}
