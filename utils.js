module.exports = {
    webName: function (siteName) {
        let result = siteName.substring(0,siteName.length-5);
        //http
        if(result.substring(0,8) === "https://"){
            result = siteName.substring(8, result.length);
        }else if(result.substring(0,7) === "http://"){
            result = siteName.substring(7, result.length);
        }else{
            result = result;
        }
        if(result.substring(0,3) === "www"){
            result = result.substring(4, result.length);
        }else if(result.substring(0,4) === "blog"){
            result = result.substring(5, result.length);
        }else{
            result = result;
        }
        return result;
    },

};