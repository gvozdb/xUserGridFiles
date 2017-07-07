<?php
class xugUserFieldGetListProcessor extends modObjectGetListProcessor
{
    public $objectType = 'modUserProfile';
    public $classKey = 'modUserProfile';
    public $country_lang = array();

    /**
     * @return string
     */
    public function process()
    {
        $output = array(
            array(
                'display' => '(Все)',
                'value' => '',
            ),
        );

        if ($key = $this->getProperty('key')) {
            $sortkey = $this->getProperty('sortby', '`' . $key . '`');

            $c = $this->modx->newQuery($this->classKey)
                ->select($key)
                ->limit(0)
                ->sortby($sortkey, $this->getProperty('sortdir', 'ASC'))
                ->groupby('`' . $key . '`');

            if ($c->prepare() && $c->stmt->execute()) {
                $rows = $c->stmt->fetchAll(PDO::FETCH_COLUMN);
                foreach ($rows as $v) {
                    $tmp = array(
                        'display' => $v ?: '(Не указано)',
                        'value' => $v ?: '_',
                    );
                    if ($key == 'country' && !empty($v)) {
                        $tmp['display'] = $this->getCountry(strtolower($v));
                    }

                    $output[] = $tmp;
                }
            }
        }

        return $this->outputArray($output);
    }

    /**
     * Преобразование ключа страны в название на языке бек-энда
     *
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
return 'xugUserFieldGetListProcessor';