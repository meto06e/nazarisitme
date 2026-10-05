(function () {
  'use strict';
  var analyticsId = 'G-2JPQCH1B8C';
  var adsId = 'AW-18151184267';
  var phoneConversionTarget = 'AW-18151184267/cIXbCM_dtascEIuvlM9D';
  var contactConversionEvent = 'ads_conversion_Ki_i_1';
  var whatsappNumber = '905063284956';

  if (typeof window.gtag === 'function') {
    window.gtag('config', adsId);
  }

  function track(eventName, extra) {
    if (typeof window.gtag !== 'function') return;
    var params = Object.assign({send_to: analyticsId, page_path: window.location.pathname}, extra || {});
    window.gtag('event', eventName, params);
  }

  function trackContact(method, extra) {
    track(contactConversionEvent, Object.assign({
      contact_method: method,
      value: 1.0,
      currency: 'TRY',
      transport_type: 'beacon'
    }, extra || {}));
  }

  function reportPhoneConversion(url) {
    var navigated = false;
    var timer;

    function navigate() {
      if (navigated || !url) return;
      navigated = true;
      window.clearTimeout(timer);
      window.location.href = url;
    }

    timer = window.setTimeout(navigate, 800);
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: phoneConversionTarget,
        value: 1.0,
        currency: 'TRY',
        event_callback: navigate,
        event_timeout: 800
      });
    } else {
      navigate();
    }
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
      trackContact('whatsapp_form', {form_id: form.id || 'leadForm'});
      var target = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
      window.open(target, '_blank', 'noopener,noreferrer');
    });
  });

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) {
      track('phone_click');
      // Ana sayfadaki eski iki düğüm kendi dönüşüm işleyicisini zaten çağırıyor.
      if ((link.getAttribute('onclick') || '').indexOf('gtag_report_conversion') !== -1) return;
      event.preventDefault();
      reportPhoneConversion(href);
    } else if (href.indexOf('https://wa.me/') === 0) {
      track('whatsapp_click');
      trackContact('whatsapp_link');
    }
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
