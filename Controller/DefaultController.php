<?php

namespace ManuelAguirre\Bundle\TranslationBundle\Controller;

use ManuelAguirre\Bundle\TranslationBundle\Entity\Translation;
use ManuelAguirre\Bundle\TranslationBundle\Entity\TranslationValue;
use ManuelAguirre\Bundle\TranslationBundle\Form\Type\TranslationFilterType;
use ManuelAguirre\Bundle\TranslationBundle\Form\Type\TranslationType;
use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Pagerfanta;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Translation\MessageCatalogue;

class DefaultController extends Controller
{

    protected $isServer = false;
    protected $hasServer = false;

    public function setContainer(ContainerInterface $container = null)
    {
        parent::setContainer($container);

        if ($container->hasParameter('manuel_translation.server.api_key')) {
            $this->isServer = true;
        }

        if ($container->has('manuel_translation.server_sync')) {
            $this->hasServer = true;
        }
    }


    /**
     * @Route("/list/{page}", name="manuel_translation_list", defaults={"page" = 1})
     */
    public function indexAction(Request $request, $page = 1)
    {
        $session = $this->get('session');
        $filters = $session->get('manuel_translations.trans_filter', array(
            'search' => null,
            'conflicts' => null,
            'changed' => null,
            'inactive' => false,
            'domains' => array('messages'),
        ));

        $formFilter = $this->createForm('translation_filter', $filters, array('method' => 'post'))
            ->handleRequest($request);


        if ($formFilter->isSubmitted()) {
            $filters = $formFilter->getData();
            $session->set('manuel_translations.trans_filter', $filters);
        }

        $query = $this->getDoctrine()
            ->getRepository('ManuelTranslationBundle:Translation')
            ->getAllQueryBuilder($filters['search'], $filters['domains']
                , $filters['conflicts'], $filters['changed'], $filters['inactive']);

        $form = $this->createForm('manuel_translation', $this->getNewTranslationInstance());

        $paginator = new Pagerfanta(new DoctrineORMAdapter($query, false));
        $paginator->setMaxPerPage(50);
        $paginator->setCurrentPage($page);

        return $this->render('@ManuelTranslation/Default/index.html.twig', array(
            'translations' => $paginator,
            'form' => $form->createView(),
            'locales' => $this->container->getParameter('manuel_translation.locales'),
            'form_filter' => $formFilter->createView(),
            'enable_sync' => $this->hasServer,
        ));
    }

    /**
     * @Route("/remove-filters", name="manuel_translation_remove_filters")
     */
    public function clearFiltersAction()
    {
        $this->get('session')->remove('manuel_translations.trans_filter');

        return $this->redirectToRoute('manuel_translation_list');
    }

    /**
     * @Route("/save/{id}",
     * name="manuel_translation_save_translation"
     * )
     *
     * @Method("POST")
     */
    public function saveTranslationAction(Translation $translation, Request $request)
    {
        $form = $this->createForm('manuel_translation', $translation)
            ->handleRequest($request);

        if ($form->isSubmitted() and $form->isValid()) {

            if ($this->isServer) {
                //cuando somos un servidor, cada cambio debe notarse para los clientes.
                $translation->setServerEditions($translation->getServerEditions() + 1);
            }

            $this->get('manuel_translation.translations_repository')->saveTranslation($translation);

            $filesystem = new Filesystem();
            $filenameTemplate = $this->container->getParameter('manuel_translation.filename_template');

            foreach ($translation->getValues() as $locale => $value) {
                $filename = sprintf($filenameTemplate, $locale);
                $filesystem->dumpFile($filename, time());
            }
        } else {
            return $this->render('@ManuelTranslation/form_errors.html.twig', array(
                'form' => $form->createView(),
            ));
        }

        return new Response('Ok');
    }

    /**
     * @Route("/save-new",
     * name="manuel_translation_save_translation_new"
     * )
     *
     * @Method("POST")
     */
    public function saveNewTranslationAction(Request $request)
    {
        return $this->saveTranslationAction($this->getNewTranslationInstance(), $request);
    }

    /**
     * @return Translation
     */
    protected function getNewTranslationInstance()
    {
        $translation = new Translation();
        $translation->setNew(false);
        $translation->setAutogenerated(false);
        $translation->setActive(true);

        foreach ($this->container->getParameter('manuel_translation.locales') as $locale) {
            $translation->setValue($locale, null);
        }

        return $translation;
    }

    /**
     * @Route("/save-from-profiler", name="manuel_translation_save_from_profiler")
     */
    public function saveFromProfilerAction(Request $request)
    {
        $translation = $this->getNewTranslationInstance();
        $translation->setCode($request->request->get('code'));
        $translation->setDomain($request->request->get('domain'));

        foreach ($request->request->get('values', array()) as $locale => $value) {
            $translation->setValue($locale, $value);
        }

        if(count($this->get('validator')->validate($translation)) == 0){
            $this->get('manuel_translation.translations_repository')->saveTranslation($translation);

            $filesystem = new Filesystem();
            $filenameTemplate = $this->container->getParameter('manuel_translation.filename_template');

            foreach ($translation->getValues() as $locale => $value) {
                $filename = sprintf($filenameTemplate, $locale);
                $filesystem->dumpFile($filename, time());
            }
        }


        return new Response('Ok');
    }
}
