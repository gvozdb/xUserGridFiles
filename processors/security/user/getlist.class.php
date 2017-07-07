<?php

require_once MODX_CORE_PATH . 'model/modx/modprocessor.class.php';
require_once MODX_CORE_PATH . 'model/modx/processors/security/user/getlist.class.php';

class xugUserGetListProcessor extends modUserGetListProcessor
{
    public $country_lang = array();

    /**
     * @param xPDOQuery $c
     *
     * @return xPDOQuery
     */
    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $c = parent::prepareQueryBeforeCount($c);

        // Фильтр
        foreach (array('country') as $v) {
            if (${$v} = $this->getProperty($v, 0)) {
                if (${$v} == '_') {
                    $c->where(array(
                        '(Profile.' . $v . ' = "" OR Profile.' . $v . ' IS NULL)',
                    ));
                } else {
                    $c->where(array(
                        'Profile.' . $v => ${$v},
                    ));
                }
            }
        }

        return $c;
    }

    /**
     * @param xPDOQuery $c
     *
     * @return xPDOQuery
     */
    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c = parent::prepareQueryAfterCount($c);

        $c->select($this->modx->getSelectColumns('modUserProfile', 'Profile', '', array(
            'dob',
            'country',
            'city',
        )));

        return $c;
    }

    /**
     * @param xPDOObject $object
     *
     * @return array
     */
    public function prepareRow(xPDOObject $object)
    {
        $objectArray = parent::prepareRow($object);

        $objectArray['dob'] = $object->get('dob') ? date('d.m.Y', $object->get('dob')) : '';
        $objectArray['country'] = $object->get('country') ? $this->getCountry(strtolower($object->get('country'))) : '';

        return $objectArray;
    }

    /**
     * @param string $key
     *
     * @return array
     */
    public function getCountry($key = '')
    {
        if (empty($this->country_lang)) {
            $_country_lang = array();
            include $this->modx->getOption('core_path') . 'lexicon/country/en.inc.php';
            if ($this->modx->getOption('manager_language') != 'en' &&
                file_exists($this->modx->getOption('core_path') . 'lexicon/country/' . $this->modx->getOption('manager_language') . '.inc.php')
            ) {
                include $this->modx->getOption('core_path') . 'lexicon/country/' . $this->modx->getOption('manager_language') . '.inc.php';
            }
            asort($_country_lang);
            $this->country_lang = $_country_lang;
        }

        return empty($key) ? $this->country_lang : (!empty($this->country_lang[$key]) ? $this->country_lang[$key] : '');
    }
}
return 'xugUserGetListProcessor';