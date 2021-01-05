`use strict`;
/**
 * @link https://github.com/KefirchickTod/PhoneMask
 * @version 0.1.2
 * @author Zahar Pylypchuck <zacahrpu2@gmail.com>
 *
 */
(function ($, window) {
    const phoneJsonUrl = 'https://api.npoint.io/d0ac985ca62e2966ec70';
    const globalSelectClass = 'phoneSelectMask form-control col-md-4';
    const globalSelectIndex = '.phoneSelectMask';
    class PhoneMask{
        constructor() {
            let countriesList = null;
            $.getJSON(phoneJsonUrl, function (result) {
                // selectCode = $this.renderPhoneMask($this, result);
                countriesList = result;
            });

        }

        init(selector,url, relatedInput) {
            this.url = url;
            this.relatedInput = relatedInput;
            this.selector = selector;
            this.validAttr($(this.selector));

        }

        validAttr(selector){
            if(!selector.attr('maxlength')){
                selector.attr('maxlength', '13');
            }
        }
        /**
         *
         * @param  maskPattern
         */
        setMask(maskPattern){
            this.selector.mask(maskPattern);
        }
        renderPhoneMask($this,inputJson){
            let lengthJson = inputJson.length;
            let selectCode = null;
            for(let i = 0; i < inputJson.length; i++){
                let phoneMask = inputJson[i];
                if(typeof phoneMask != 'object'){
                    console.error("Undefined phone mask");
                    return false;
                }

                let code = phoneMask.code;

                let countryName = phoneMask.countryName;
                let select = '';

                if($this.relatedInput.val() === code){
                    select = 'selected';
                    selectCode = code;
                }

                $this.relatedInput.append("<option "+select+" value='"+code+"'>"+countryName+"</option>");
            }

            return  selectCode;
        }
        proccess(){
            let $this = this;
            let selectCode = null;

            if($this.countriesList !== null){
                $.getJSON($this.url, function (result) {
                    selectCode = $this.renderPhoneMask($this,result);
                    $this.countriesList = result;
                });
            }

            if(selectCode !== null){
                $this.relatedInput.val(selectCode).trigger('change');
            }
            $this.relatedInput.change(function () {
                let val = $(this).val();
                for (var i = 0; i < $this.countriesList.length; i++) {

                    let countriesCode =  $this.countriesList[i].code;
                    let countriesPhoneCode = $this.countriesList[i].phoneCode;

                    if(val === countriesCode){
                        $this.selector.attr('readonly', false);
                        $this.selector.val(countriesPhoneCode);
                        break;
                    }else{
                        $this.selector.attr('readonly', true);
                        $this.selector.val('');
                    }
                }
            });

            $this.selector.keyup(function () {
                if(!this.value || this.value === '+'){
                    $this.relatedInput.val('none').trigger('change');
                }
                if(this.value.length > 2){
                    let code = this.value;
                    for (var i = 0; i < $this.countriesList.length; i++) {
                        let countriesCode =  $this.countriesList[i].code;
                        let countriesPhoneCode = $this.countriesList[i].phoneCode;
                        if(code === countriesPhoneCode){
                            $this.relatedInput.val(countriesCode).trigger('change');
                            break;
                        }
                    }

                }
            });
        }

    }



    var mask = new PhoneMask();


    $.fn.phoneMask = function(setting){

        setting = typeof setting == 'undefined' ? {} : setting;

        if(!('select' in setting)){
            let select = document.createElement('select');
            $(select)
                .addClass(globalSelectClass)
                .appendTo($(this).parent());
            setting.select = globalSelectIndex;
            $(this).addClass('col-md-8');
        }

        mask.init($(this), phoneJsonUrl, $(setting.select));
        if(typeof setting.mask != 'undefined'){
            mask.setMask(setting.mask);
        }
        mask.proccess();



    };
})(jQuery, window);