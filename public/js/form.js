const form=document.getElementById('form');
const username=document.getElementById('username')
const password=document.getElementById('password')


form.addEventListener('submit',e=>{
    e.preventDefault();

    validateInputs();
});

const setError=(element,message)=>{
    const inputControl=element.presentElement;
    const errorDisplay=inputControl.querySelector('.error')


    errorDisplay.innerText=message;
    inputControl.classList.remove('success')
}
const setSuccess=element=>{
    const inputControl=element.parentElement;
    const errorDisplay=inputControl.querySelector('.error');


    errorDisplay.innerText="";
    inputControl.classList.add('success');
};


const validateInputs=()=>{
    const usernameValue=username.Value.trim();
    const passwordValue=password.value.trim()


    if(usernameValue ===''){
        setError(username,"username is required");


    }else{
        setSuccess(username);

    }

}

