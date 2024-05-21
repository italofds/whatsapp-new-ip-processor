import $ from 'jquery';

// It works for both versions of Meta company's responses, before and after 2024. 
// To achieve this, the code searches for elements in tables (old format) or in divs (new format).

export function fileProcess(htmlString) {

    htmlString = htmlString.replace(/src=/gi, 'data-src=').replace(/href=/gi, 'data-href=');//Disable source loading from 'src' and 'href' attributes
    const $html = $(htmlString);

    $html.find('.pageBreak').remove();
    const $htmlText = $html.text().replace(/\s+/g, '');

    const regexTimestamp = /Time(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})UTC/g;
    let matchTimestamp;
    const timestamps = [];

    while ((matchTimestamp = regexTimestamp.exec($htmlText)) !== null) {
      const data = matchTimestamp[1];
      const hora = matchTimestamp[2];
      timestamps.push(`${data} ${hora} UTC`);
    }

    const regexIP =   /IPAddress((?:\d{1,3}\.){3}\d{1,3}|(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4})/g;
    let matchIps;
    const ips = [];    

    while ((matchIps = regexIP.exec($htmlText)) !== null) {
        ips.push(matchIps[1]);
    }

    if (ips.length !== timestamps.length) {
        console.error("An error occurred while processing the logs file: timestamp quantities and IP address do not match.");
        return [];
    }

    const results = ips.map((ip, index) => ({
        ip: formatIP(ip),
        timestamp: timestamps[index]
    }));

    return results;
  }

  function formatIP(IPAddressRaw){
	var ipAddressFormated;

	// Check if it's IPv4
	if(IPAddressRaw.indexOf(":") == -1) {
		ipAddressFormated = IPAddressRaw;		
	}

	// Check if it's IPv6
	else {
		var arrayIPParts = IPAddressRaw.split(":");
		var arrayIPPartsFormated = [];

		for (let ipPart of arrayIPParts) {
			if(ipPart.length < 2) {
				ipPart = "000" + ipPart;
			} else if(ipPart.length < 3) {
				ipPart = "00" + ipPart;
			} else if(ipPart.length < 4) {
				ipPart = "0" + ipPart;
			}
			
			arrayIPPartsFormated.push(ipPart);
		} 
		
		ipAddressFormated = arrayIPPartsFormated.join(":");
	}
	
	return ipAddressFormated.toUpperCase();
}
  