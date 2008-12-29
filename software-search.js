CmdUtils.CreateCommand({
  name: "software-search",
  homepage: "http://garrett.github.com/ubiquity-software-search/",
  author: { name: "Garrett LeSage", email: "garrett@novell.com"},
  license: "MPL",
  description: "Searches software.openSUSE.org on the selected text (or any custom string).",
  //help: "",

  takes: {"software package name": noun_arb_text},
  preview: function(pblock, directObject){
    var url = {
      // XHR response URL
      template: "http://software.opensuse.org/search/search?baseproject={BASE}&commit=Search&q={QUERY}",
      base: "Fedora:8",
      query: directObject.text
    };

    url.string = url.template.replace("{QUERY}", url.query).replace("{BASE}", url.base);

    if (!directObject.text) {
      pblock.innerHTML = "Quickly search software.openSUSE.org";
    } else if (directObject.text.length < 3) {
      pblock.innerHTML = "Please enter at least 3 characters.";
    } else {
      pblock.innerHTML = "Loading statistics...";

      jQuery.get( url.string, function( data ) {
        var result = data.match(/search_top_info">(.*)</)[1];

        // Array of numbers, as such: [collection, binary, source], # of matches
        var match = result.match(/([0-9]+)/g);

        if (match.join() !== '0,0,0') {
          result = [ 'Found' ];
          if (match[1] != 0) { result.push(' ', match[1], ' packages'); }
          if (match[1] != 0 && match[2] != 0) { result.push(' and'); }
          if (match[2] != 0) { result.push(' ', match[2], ' source packages'); }
          if (match[0] != 0) { result.push(' in ', match[0], ' collections'); }
          result.push('.');
          pblock.innerHTML = result.join('');
        } else {
          pblock.innerHTML = 'No matches found.';
        }

        //CmdUtils.log('FOO');
      });
    }
  },

  execute: function(directObject) {
    var url = {
      // Web page URL
      template: "http://software.opensuse.org/search?baseproject={BASE}&p=1&q={QUERY}",
      base: "ALL",
      query: directObject.text
    };

    url.string = url.template.replace("{QUERY}", url.query).replace("{BASE}", url.base);
    Utils.openUrlInBrowser(url.string);
  }
});
