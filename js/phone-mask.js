(function ($, window) {
    const phoneJsonUrl = 'https://api.npoint.io/d0ac985ca62e2966ec70';
    class PhoneMask{

        constructor(selector,url, relatedInput) {
            this.url = url;
            this.relatedInput = relatedInput;
            this.selector = selector;
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
            let countriesList = null;
            let selectCode = null;
            $.getJSON($this.url, function (result) {
                selectCode = $this.renderPhoneMask($this,result);
                countriesList = result;
            });
            if(selectCode !== null){
                $this.relatedInput.val(selectCode).trigger('change');
            }
            $this.relatedInput.change(function () {
                let val = $(this).val();
                for (var i = 0; i < countriesList.length; i++) {

                    let countriesCode =  countriesList[i].code;
                    let countriesPhoneCode = countriesList[i].phoneCode;

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
                if(!this.value){
                    $this.relatedInput.val('none').trigger('change');
                }
            });
        }
    }
    $.fn.phoneMask = function(setting){

        if(typeof setting.select == 'undefined'){
            console.error("Undefined select inpput");
        }

        let mask = new PhoneMask($(this), phoneJsonUrl, $(setting.select));
        if(typeof setting.mask != 'undefined'){
            mask.setMask(setting.mask);
        }
        mask.proccess();



    };
})(jQuery, window);