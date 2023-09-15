
//testy
console.log(get_id("7ABLbnD53cQK00mhcaOUVG"))
console.log(get_id("https://open.spotify.com/track/7ABLbnD53cQK00mhcaOUVG"))
console.log(get_id("prywatny bal"))

async function get_id(value)
{
    //sprawdzenie czy podany ciąg jest id poprzez weryfikacje długości oraz czy zawiera spacje
    if(value.indexOf(" ")==-1&&value.length==22)
    {
        return(value)
    }
    else
    {
        //dzielenie ciągu na tablice
        let string = value.split("/");
        //weryfikacja czy link jest prawidłowy
        if(string[3]=="track"&&string[4].length==22)
        {
            return(string['4'])
        }
        //dany ciąg nie pasuje do kryteriów przez co prawdopodobnie jest to tytuł 
        else
        {
            return(false)
        }
    }
}