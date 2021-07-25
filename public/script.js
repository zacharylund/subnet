function long2ip(ip) {
  // eslint-disable-next-line no-bitwise
  return [(ip >>> 24) & 0xFF, (ip >>> 16) & 0xFF, (ip >>> 8) & 0xFF, ip & 0xFF].join('.');
}

function ip2long(ip) {
  const octets = ip.split('.');

  return octets[0] * (2 ** 24) + octets[1] * (2 ** 16) + octets[2] * (2 ** 8) + octets[3] * 1;
}

function update() {
  const ip = ip2long(document.getElementById('ip').value);
  const bits = parseInt(document.getElementById('bits').value, 10);

  const total = 2 ** (32 - bits);
  const mask = 2 ** 32 - 2 ** (32 - bits);
  const network = ip & mask; // eslint-disable-line no-bitwise
  const broadcast = ip | ~mask; // eslint-disable-line no-bitwise
  const cidr = `${long2ip(network)}/${bits}`;

  document.title = `Subnet Calculator - ${cidr}`;

  document.getElementById('cidr').innerHTML = cidr;
  document.getElementById('total').innerHTML = total;
  document.getElementById('usable').innerHTML = total > 3 ? total - 2 : '-';
  document.getElementById('mask').innerHTML = long2ip(mask);
  document.getElementById('network').innerHTML = long2ip(network);
  document.getElementById('broadcast').innerHTML = long2ip(broadcast);
  document.getElementById('first').innerHTML = total > 3 ? long2ip(network + 1) : '-';
  document.getElementById('last').innerHTML = total > 3 ? long2ip(broadcast - 1) : '-';
}

document.addEventListener('DOMContentLoaded', () => {
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

  const links = document.querySelectorAll('.nav-link');

  for (let i = 0; i < links.length; i += 1) {
    links[i].addEventListener('click', (event) => {
      event.preventDefault();

      const newUrl = new URL(event.currentTarget.href);

      ipInput.value = newUrl.searchParams.get('ip');
      bitsInput.value = newUrl.searchParams.get('bits');

      update();

      window.history.pushState({}, '', newUrl);
    });
  }

  subnetForm.onsubmit = (event) => {
    event.preventDefault();

    update();

    const newUrl = new URL(window.location);

    newUrl.searchParams.set('ip', ipInput.value);
    newUrl.searchParams.set('bits', bitsInput.value);

    window.history.pushState({}, '', newUrl);
  };

  window.addEventListener('popstate', () => {
    const newUrl = new URL(window.location);

    ipInput.value = newUrl.searchParams.get('ip');
    bitsInput.value = newUrl.searchParams.get('bits');

    update();
  });
});
