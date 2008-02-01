var consumer = {};

consumer.example =
{ consumerKey   : "myKey"
, consumerSecret: "mySecret"
, serviceProvider:
  { signatureMethod     : "HMAC-SHA1"
  , requestTokenURL     : "http://localhost/oauth-provider/request_token"
  , userAuthorizationURL: "http://localhost/oauth-provider/authorize"
  , accessTokenURL      : "http://localhost/oauth-provider/access_token"
  , echoURL             : "http://localhost/oauth-provider/echo"
  }
};

consumer.mediamatic =
{ consumerKey   : "e388e4f4d6f4cc10ff6dc0fd1637da370478e49e2"
, consumerSecret: "0b062293b6e29ec91a23b2002abf88e9"
, serviceProvider:
  { signatureMethod     : "HMAC-SHA1"
  , requestTokenURL     : "http://oauth-sandbox.mediamatic.nl/module/OAuth/request_token"
  , userAuthorizationURL: "http://oauth-sandbox.mediamatic.nl/module/OAuth/authorize"
  , accessTokenURL      : "http://oauth-sandbox.mediamatic.nl/module/OAuth/access_token"
  , echoURL             : "http://oauth-sandbox.mediamatic.nl/services/rest/?method=anymeta.test.echo"
  }
};

consumer.termie =
{ consumerKey   : "key"
, consumerSecret: "secret"
, accessToken: "requestkey"
, accessTokenSecret: "requestsecret"
, echo: "accesskey"
, echoSecret: "accesssecret"
, serviceProvider:
  { signatureMethod     : "HMAC-SHA1"
  , requestTokenURL     : "http://term.ie/oauth/example/request_token.php"
  , userAuthorizationURL: "accessToken.html" // a stub
  , accessTokenURL      : "http://term.ie/oauth/example/access_token.php"
  , echoURL             : "http://term.ie/oauth/example/echo_api.php"
  }
};

consumer.initializeForm =
function initializeForm(form, etc, usage) {
    var selector = etc.elements[0];
    var selection = selector.options[selector.selectedIndex].value;
    var selected = consumer[selection];
    if (selected != null) {
        etc.URL.value                     = selected.serviceProvider[usage + "URL"];
        form.oauth_signature_method.value = selected.serviceProvider.signatureMethod;
        form.oauth_consumer_key.value     = selected.consumerKey;
        etc.consumerSecret.value          = selected.consumerSecret;
        if (selected[usage] != null) form.oauth_token.value = selected[usage];
        if (selected[usage + "Secret"] != null) etc.tokenSecret.value = selected[usage + "Secret"];
    }
    return true;
};

consumer.signForm =
function signForm(form, etc) {
    form.action = etc.URL.value;
    var accessor = { consumerSecret: etc.consumerSecret.value
                   , tokenSecret   : etc.tokenSecret.value};
    var message = { action: form.action
                  , method: form.method
                  , parameters: []
                  };
    for (var e = 0; e < form.elements.length; ++e) {
        var input = form.elements[e];
        if (input.name != null && input.name != "" && input.value != null
            && (!(input.type == "checkbox" || input.type == "radio") || input.checked))
        {
            message.parameters.push([input.name, input.value]);
        }
    }
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    //alert(outline("message", message));
    var parameterMap = OAuth.getParameterMap(message.parameters);
    for (var p in parameterMap) {
        if (p.substring(0, 6) == "oauth_"
         && form[p] != null && form[p].name != null && form[p].name != "")
        {
            form[p].value = parameterMap[p];
        }
    }
    return true;
};
