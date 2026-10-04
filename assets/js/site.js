(function () {
  'use strict';
  var analyticsId = 'G-2JPQCH1B8C';
  var whatsappNumber = '905063284956';

  function track(eventName, extra) {
    if (typeof window.gtag !== 'function') return;
    var params = Object.assign({send_to: analyticsId, page_path: window.location.pathname}, extra || {});
    window.gtag('event', eventName, params);
  }

  document.querySelectorAll('#leadForm, form.leadForm').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      var name = form.querySelector('#ad, .ad').value.trim();
      var phone = form.querySelector('#tel, .tel').value.trim();
      var subject = form.querySelector('#konu, .konu').value;
      var message = 'Merhaba, ismim ' + name + '. Telefon numaram: ' + phone + '. ' + subject;
      // Kişisel form bilgileri Analytics'e gönderilmez.
      track('whatsapp_form_submit', {form_id: form.id || 'leadForm'});
      var target = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
      window.open(target, '_blank', 'noopener,noreferrer');
    });
  });

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) track('phone_click');
    else if (href.indexOf('https://wa.me/') === 0) track('whatsapp_click');
  });

  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      var menu = document.querySelector('.navbar-collapse.show');
      if (menu && window.bootstrap && window.bootstrap.Collapse) {
        window.bootstrap.Collapse.getOrCreateInstance(menu, {toggle: false}).hide();
      }
    });
  });

  if (typeof window.GLightbox === 'function') window.GLightbox({selector: '.glightbox'});

  document.querySelectorAll('.tour-thumb').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      document.querySelectorAll('.tour-thumb').forEach(function (item) { item.classList.remove('active'); });
      thumb.classList.add('active');
      var image = document.getElementById('tourImage');
      var title = document.getElementById('tourTitle');
      var text = document.getElementById('tourText');
      if (image) {
        image.src = thumb.dataset.img;
        image.alt = 'Nazar İşitme Merkezi - ' + thumb.dataset.title;
      }
      if (title) title.textContent = thumb.dataset.title;
      if (text) text.textContent = thumb.dataset.text;
    });
  });
})();
