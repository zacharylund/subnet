function long2ip (ip) {
	return [ip >>> 24 & 0xFF, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.');
}

function ip2long (ip) {
	const octets = ip.split('.');

	return octets[0] * (2 ** 24) + octets[1] * (2 ** 16) + octets[2] * (2 ** 8) + octets[3] * 1;
}

function update () {
	const ip = ip2long(document.getElementById('ip').value);
	const bits = parseInt(document.getElementById('bits').value);

	const total = 2 ** (32 - bits);
	const mask = 2 ** 32 - 2 ** (32 - bits);
	const network = ip & mask;
	const broadcast = ip | ~mask;
	const cidr = long2ip(network) + '/' + bits;

	document.title = 'Subnet Calculator - ' + cidr;

	document.getElementById('cidr').innerHTML = cidr;
	document.getElementById('total').innerHTML = total;
	document.getElementById('usable').innerHTML = total > 3 ? total - 2 : '-';
	document.getElementById('mask').innerHTML = long2ip(mask);
	document.getElementById('network').innerHTML = long2ip(network);
	document.getElementById('broadcast').innerHTML = long2ip(broadcast);
	document.getElementById('first').innerHTML = total > 3 ? long2ip(network + 1) : '-';
	document.getElementById('last').innerHTML = total > 3 ? long2ip(broadcast - 1) : '-';
}

document.addEventListener('DOMContentLoaded', function () {
	const url = new URL(window.location);
	const subnetForm = document.getElementById('subnet-form');
	const ipInput = document.getElementById('ip');
	const bitsInput = document.getElementById('bits');

	if (!ipInput.value) {
		ipInput.value = url.searchParams.get('ip');
	}

	if (!bitsInput.value) {
		bitsInput.value = url.searchParams.get('bits');
	}

	if (subnetForm.checkValidity()) {
		update();
	}

	var links = document.querySelectorAll('.nav-link');

	for (i = 0; i < links.length; i++) {
		links[i].addEventListener('click', function(e) {
			e.preventDefault();

			const url = new URL(this.href);

			ipInput.value = url.searchParams.get('ip');
			bitsInput.value = url.searchParams.get('bits');

			update();

			window.history.pushState({}, '', url);
		});
	}

	subnetForm.onsubmit = function (event) {
		event.preventDefault();

		update();

		const url = new URL(window.location);

		url.searchParams.set('ip', ipInput.value);
		url.searchParams.set('bits', bitsInput.value);

		window.history.pushState({}, '', url);
	};

	window.addEventListener('popstate', function () {
		const url = new URL(window.location);

		ipInput.value = url.searchParams.get('ip');
		bitsInput.value = url.searchParams.get('bits');

		update();
	});
});
