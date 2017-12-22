const hashToTest = 'QmPsVjJasZeSgNMwmti7Jap75yj8WvkcUNepDwgWmRea5b'

const $results = document.querySelector('#results')

function addNode (gateway, online, title) {
	const para = document.createElement('div')
	let node
	if (online) {
		node = document.createElement('strong')
		node.innerText = '✅ - Online  - ' + gateway
	} else {
		node = document.createElement('div')
		node.innerText = '❌ - Offline - ' + gateway
	}
	node.setAttribute('title', title)
	para.appendChild(node)
	$results.appendChild(para)
}

function updateStats (total, checked) {
	document.getElementById('stats').innerText = checked + '/' + total + ' gateways checked'
}

function checkGateways (gateways) {
  const total = gateways.length
  let checked = 0
  gateways.forEach((gateway) => {
    const gatewayAndHash = gateway.replace(':hash', hashToTest)
    // fetch(gatewayAndHash)
    //   .then(res => res.text())
    //   .then((text) => {
    //     const matched = text.trim() === hashString.trim()
    //     addNode(gatewayAndHash, matched, matched ? 'All good' : 'Output did not match expected output')
    //     checked++
    //     updateStats(total, checked)
    //   }).catch((err) => {
    //     window.err = err
    //     addNode(gatewayAndHash, false, err)
    //     checked++
    //     updateStats(total, checked)
    //   })
    
    // lets just check status code
    var request = new XMLHttpRequest();
    request.open("HEAD", gatewayAndHash, true);
    request.onerror = function(e) {
      addNode(gatewayAndHash, false, 'Could not get headers')
      checked++
      updateStats(total, checked)
    }
    request.onreadystatechange = function() {
      if(this.readyState === this.HEADERS_RECEIVED) {
        if (this.status === 200) {
          addNode(gatewayAndHash, true, this.getAllResponseHeaders())
          checked++
          updateStats(total, checked)
        } else {
          //console.log(this.status)
        }
      }
    }
    request.send();
  })
}

//fetch('https://skzap.github.io/public-gateway-checker/gateways.json')
fetch('./gateways.json')
  .then(res => res.json())
  .then(gateways => checkGateways(gateways))
