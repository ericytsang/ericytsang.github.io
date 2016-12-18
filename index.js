var R = {
    class: {
        opened: "opened",
        closed: "closed",
        selected: "selected",
        collapsibleList: "collapsibleList",
        collapsibleListClosed: "collapsibleListClosed",
        collapsibleListOpen: "collapsibleListOpen"
    },
    element: {
        navdrawer: document.getElementById("navdrawer"),
        navdrawercontent: document.getElementById("navdrawercontent"),
        title: document.getElementById("title"),
        content: document.getElementById("content")
    },
    getparamkeys: {
        contenturl: "contenturl",
        pagetitle: "pagetitle"
    }
}

function httpGet(url)
{
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    }
    else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET",url,false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

function toggleNavDrawer()
{
    if (R.element.navdrawer.classList.contains(R.class.closed))
    {
        R.element.navdrawer.classList.add(R.class.opened);
        R.element.navdrawer.classList.remove(R.class.closed);
        localStorage.navdrawerstate=R.class.opened
    }
    else
    {
        R.element.navdrawer.classList.remove(R.class.opened);
        R.element.navdrawer.classList.add(R.class.closed);
        localStorage.navdrawerstate=R.class.closed
    }
    return true;
}

function parseGetParameters(url)
{
    var query_string = {};
    if (url == null)
    {
        url = window.location.search;
    }
    var query = url.substr(url.indexOf("?")).substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++)
    {
        var pair = vars[i].split("=");

        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined")
        {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
        }

        // If second entry with this name
        else if (typeof query_string[pair[0]] === "string")
        {
            var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
            query_string[pair[0]] = arr;
        }

        // If third or later entry with this name
        else
        {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}

var converter = new showdown.Converter();

// populate navigation drawer with content
var text = httpGet("./index.md");
R.element.navdrawercontent.innerHTML = converter.makeHtml(text);

// post-process all links in the navigation drawer
var descendants = R.element.navdrawercontent.getElementsByTagName('a');
for (var i = -1, l = descendants.length; ++i < l;)
{
    descendants[i].href = "./index.html"+
        "?"+R.getparamkeys.contenturl+"="+descendants[i].href+
        "&"+R.getparamkeys.pagetitle+"="+descendants[i].text;
}

// post-process all uls in the navigation drawer
var descendants = R.element.navdrawercontent.getElementsByTagName('ul');
for (var i = -1, l = descendants.length; ++i < l;)
{
    descendants[i].classList.add(R.class.collapsibleList);
}

// restore navigation drawer state from local storage
if (localStorage.navdrawerstate != null)
{
    R.element.navdrawer.classList.remove(R.class.closed);
    R.element.navdrawer.classList.remove(R.class.opened);
    R.element.navdrawer.classList.add(localStorage.navdrawerstate);
}

// parse parameters
var getParameters = parseGetParameters()

// if no parameters are parsed, substitute them
var descendants = R.element.navdrawercontent.getElementsByTagName('a');
if (getParameters.contenturl == null)
{
    window.location = descendants[0].href;
    getParameters.contenturl = parseGetParameters().contenturl;
    getParameters.pagetitle = descendants[0].text;
    console.log(getParameters.contenturl);
    console.log(getParameters.pagetitle);
}

// set title from parameters
R.element.title.innerHTML = getParameters.pagetitle;

// populate content area with specified content from parameters
var text = httpGet(getParameters.contenturl);
var content = R.element.content;
content.innerHTML = converter.makeHtml(text);

// if contenturl is the index.md, process the lings in it as well
if (getParameters.contenturl.indexOf("index.md") != -1)
{
    var descendants = R.element.content.getElementsByTagName('a');
    for (var i = -1, l = descendants.length; ++i < l;)
    {
        descendants[i].href = "./index.html"+
            "?"+R.getparamkeys.contenturl+"="+descendants[i].href+
            "&"+R.getparamkeys.pagetitle+"="+descendants[i].text;
    }
}

// do the collapsible list processing to change collapsible lists to collapsible lists
CollapsibleLists.apply();

// highlight current entry in the navigation drawer
var descendants = R.element.navdrawercontent.getElementsByTagName('a');
for (var i = descendants.length - 1; i >= 0; i--)
{
    if (descendants[i].href == window.location)
    {
        // style appropriate navigation drawer item as selected
        descendants[i].parentElement.classList.add(R.class.selected);

        // expand all collapsible parent elements
        var element = descendants[i];
        while (element != R.element.navdrawercontent)
        {
            if (element.classList.contains(R.class.collapsibleListClosed))
            {
                element.click();
            }
            element = element.parentElement;
        }
    }
}

// close the navigation drawer. the navigation drawer starts as opened. but closes upon loading to create a more seamless navigation experience
if (R.element.navdrawer.classList.contains(R.class.opened))
{
    setTimeout(toggleNavDrawer,50);
}
