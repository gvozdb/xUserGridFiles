<?php
if (file_exists(dirname(dirname(dirname(__FILE__))) . '/config.core.php')) {
    require_once dirname(dirname(dirname(__FILE__))) . '/config.core.php';
} else {
    die;
}
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';
$modx->getRequest();
$request = $modx->request;
$request->handleRequest(array(
    'processors_path' => $modx->getOption('assets_path') . 'xusergrid/processors/',
    'location' => '',
));