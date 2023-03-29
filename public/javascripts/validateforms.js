(function()
    {
        'use strict'
        const forms=document.querySelectorAll('.validated-form')
        // console.log(forms);
       const arr= Array.from(forms)
       arr.forEach(function (form){
        form.addEventListener('submit',function (event){
            if(!form.checkValidity())
            {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')

        },false)
       
       })   
    })()