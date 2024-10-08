<?php

namespace ManuelAguirre\Bundle\TranslationBundle\DependencyInjection;

use ManuelAguirre\Bundle\TranslationBundle\BackupTranslationRepository;
use ManuelAguirre\Bundle\TranslationBundle\Doctrine\Listener\ChangeTableNameListener;
use ManuelAguirre\Bundle\TranslationBundle\Translation\Loader\DoctrineLoader;
use ManuelAguirre\Bundle\TranslationBundle\Twig\Extension\ParamsExtension;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\Config\Resource\DirectoryResource;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader;
use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class ManuelTranslationExtension extends Extension
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $loader = new Loader\YamlFileLoader(
            $container,
            new FileLocator(__DIR__.'/../../config'),
            $container->getParameter('kernel.environment'),
        );
        $loader->load('services.yaml');
//        $container->addResource(new DirectoryResource(__DIR__.'/../'));

        $container->setParameter('manuel_translation.locales', $config['locales']);
        $container->setParameter('manuel_translation.catalogues_path', $config['catalogues_path']);
        $container->setParameter('manuel_translation.translations_backup_dir', $config['backup_dir']);
        $container->setParameter('manuel_translation.security_role', $config['security_role']);

        if (!$config['use_database']) {
            $container
                ->findDefinition(DoctrineLoader::class)
                ->setArgument(0, new Reference(BackupTranslationRepository::class));
        }

        if (isset($config['tables_prefix']) && $config['tables_prefix']) {
            $container
                ->findDefinition(ChangeTableNameListener::class)
                ->setArgument(0, $config['tables_prefix']);
        } else {
            $container->removeDefinition(ChangeTableNameListener::class);
        }

        if ($container->hasDefinition(ParamsExtension::class)) {
            $container
                ->findDefinition(ParamsExtension::class)
                ->setArgument(0, [
                    'header_title' => $config['header']['title'],
                    'header_path' => $config['header']['path'],
                ]);
        }
    }
}
