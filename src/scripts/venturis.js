var init = function() {

  var actionButton = document.getElementById('action-button');
  var contactModal = document.getElementById('contact-form-modal');

  var contactFormSubmitBtn = document.getElementById('contact-form-submit-btn');
  var contactModalCloseBtn = document.getElementById('contact-form-modal-close');
  var contactModalOutside = document.querySelector(".modal-background");

  var agreementCheckbox = document.getElementById('agreement');
  agreementCheckbox.addEventListener('click', function(event) {
    var state = event.target.checked;
    contactFormSubmitBtn.disabled = !state;
  });

  var closeModal = function (event) {
    contactModal.classList.remove('is-active');
  };

  var handleFormSubmit = function (event) {
    /*
    Netlify will handle form submission and thank you page.
    
    event.preventDefault();

    var content = document.getElementById('form-content');
    var thankYou = document.getElementById('form-thank-you');

    content.classList.add('is-hidden');
    thankYou.classList.remove('is-hidden');

    setTimeout(function () {
      var form = document.getElementById('contact-form');
      form.submit();
    }, 1000);*/
  }

  actionButton.addEventListener('click', function () {
    contactModal.classList.add('is-active');
  });

  contactModalCloseBtn.addEventListener('click', closeModal);
  contactModalOutside.addEventListener('click', closeModal);
  contactFormSubmitBtn.addEventListener('click', handleFormSubmit);
}

init();

