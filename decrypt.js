/*
var XMLHttpRequest = require("xhr2");
const sodium = require('libsodium-wrappers');


const Http = new XMLHttpRequest();
const url='https://79vo67ipp9.execute-api.eu-west-1.amazonaws.com/Prod/decrypt/challenges';
Http.open("POST", url);
Http.send();

Http.onreadystatechange = (e) => {
  //var data = JSON.parse(Http.responseText);
  console.log(Http.response['key']);
}*/

const fetch = require('node-fetch');
const Url = 'https://79vo67ipp9.execute-api.eu-west-1.amazonaws.com/Prod/decrypt/challenges'
const sodium = require('libsodium-wrappers');


const postParam = {
  method:"POST"
}



async function fetchData(){
  var res = await fetch(Url,postParam).then(data=>{return data.json()});
  var key = res.key;
  var challenge = res.challenge;
  var nonce = res.nonce;
  var kid = res.kid;

  var public_key = sodium.from_base64(key,sodium.base64_variants.ORIGINAL);
  var public_challenge = sodium.from_base64(challenge,sodium.base64_variants.ORIGINAL);
  var public_nonce = sodium.from_base64(nonce,sodium.base64_variants.ORIGINAL);

  console.log(public_key);

  var secret = sodium.crypto_secretbox_easy(public_challenge, public_nonce, public_key);
  var enc_secret = sodium.to_base64(secret,sodium.base64_variants.ORIGINAL);
  deleteChallenge(enc_secret,kid);

  
}

async function deleteChallenge(Data, kid){
  const deleteParam = { 
    headers : {
        "content-type": "application/json; charset = UTF-8"
    }, 
    body : JSON.stringify({"plaintext": Data}),  
    method:"DELETE"
  }
  var res = await fetch(`${Url}/${kid}`,deleteParam).then(data=>{return data.json()}).then(res =>(console.log(res))).catch(error=>console.log(error));
}

fetchData();

//in Json, header/jsonApplication
