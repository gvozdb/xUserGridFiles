<?php
require_once MODX_CORE_PATH . 'model/modx/modprocessor.class.php';
require_once MODX_CORE_PATH . 'model/modx/processors/security/user/updatefromgrid.class.php';

class xugUserUpdateFromGridProcessor extends modUserUpdateFromGridProcessor
{
    public function initialize()
    {
        if ($data = $this->getProperty('data')) {
            $data = $this->modx->fromJSON($data);
            unset($data['country']);
            $this->setProperty('data', $this->modx->toJSON($data));
        }
        
        return parent::initialize();
    }
}

return 'xugUserUpdateFromGridProcessor';