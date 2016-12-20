var R = {
    class: {
        opened: "opened",
        closed: "closed",
        selected: "selected",
        overlay: "overlay",
        collapsibleList: "collapsibleList",
        collapsibleListClosed: "collapsibleListClosed",
        collapsibleListOpen: "collapsibleListOpen"
    },
    element: {
        navdrawer: document.getElementById("navdrawer"),
        navdrawercontent: document.getElementById("navdrawercontent"),
        title: document.getElementById("title"),
        content: document.getElementById("content"),
        overlay: document.getElementById("overlay")
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
    // open the navigation drawer if it is closed
    if (R.element.navdrawer.classList.contains(R.class.closed))
    {
        R.element.navdrawer.classList.add(R.class.opened);
        R.element.navdrawer.classList.remove(R.class.closed);
        R.element.overlay.classList.add(R.class.overlay);
        localStorage.navdrawerstate=R.class.opened;
    }

    // close the navigation drawer if it is opened
    else
    {
        R.element.navdrawer.classList.remove(R.class.opened);
        R.element.navdrawer.classList.add(R.class.closed);
        R.element.overlay.classList.remove(R.class.overlay);
        localStorage.navdrawerstate=R.class.closed;
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

function loadContentMdAsHtml(markdownUrl)
{
    // generate html from the markdown
    var converter = new showdown.Converter();
    var markdown = httpGet(markdownUrl);
    var html = converter.makeHtml(markdown);

    // put the html into a temporary container so we can manipulate it then
    // extract the result
    var tempHtmlContainer = document.createElement("div");
    tempHtmlContainer.innerHTML = html;

    // replace all links to ./content/*.md with a link to ./index.html with the
    // appropriate http get parameters
    var aTags = tempHtmlContainer.getElementsByTagName('a');
    for (var i = aTags.length - 1; i >= 0; i--)
    {
        aTag = aTags[i];
        if (aTag.href.match(RegExp(window.location.host+"/.*\.md")) != null)
        {
            aTag.href = "./index.html"+
                "?"+R.getparamkeys.contenturl+"="+aTag.href+
                "&"+R.getparamkeys.pagetitle+"="+aTag.text;
        }
    }

    return tempHtmlContainer.innerHTML;
}

///////////////////////
// navigation drawer //
///////////////////////

// populate navigation drawer with content
R.element.navdrawercontent.innerHTML = loadContentMdAsHtml("./index.md");

// make the list in the navigation drawer into a collapsible list
R.element.navdrawercontent.firstChild.classList.add(R.class.collapsibleList);
CollapsibleLists.applyTo(R.element.navdrawercontent,false);

// restore navigation drawer state from local storage
if (localStorage.navdrawerstate != null)
{
    R.element.navdrawer.classList.remove(R.class.closed);
    R.element.navdrawer.classList.remove(R.class.opened);
    R.element.navdrawer.classList.add(localStorage.navdrawerstate);
}

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

// close the navigation drawer. the navigation drawer starts as opened. but
// closes upon loading to create a more seamless navigation experience
if (R.element.navdrawer.classList.contains(R.class.opened))
{
    setTimeout(toggleNavDrawer,50);
}

////////////////////////////
// page title and content //
////////////////////////////

// parse parameters
var getParameters = parseGetParameters()

// if no parameters are parsed, substitute them
var descendants = R.element.navdrawercontent.getElementsByTagName('a');
if (getParameters.contenturl == null)
{
    window.location = descendants[0].href;
    getParameters.contenturl = parseGetParameters().contenturl;
    getParameters.pagetitle = descendants[0].text;
}

// set title from parameters
R.element.title.innerHTML = getParameters.pagetitle;

// populate content area with specified content from parameters
content.innerHTML = loadContentMdAsHtml(getParameters.contenturl);
