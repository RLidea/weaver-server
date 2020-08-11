document.addEventListener('DOMContentLoaded', () => {
  const target = document.querySelector('body');

  let optionData = [];
  // eslint-disable-next-line no-undef
  axios.get('/api_history')
    .then(response => {
      optionData = response.data;
    })
    .catch(err => {
      console.error(Error(err.response.data.message));
    });

  // create an observer instance
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      // container
      const divHistory = document.createElement('div');
      divHistory.style.fontSize = '13px';
      divHistory.style.display = 'inline-block';
      divHistory.style.verticalAlign = 'middle';
      divHistory.className = 'history';

      // title
      const spanTitle = document.createElement('span');
      spanTitle.innerText = 'history: ';
      divHistory.appendChild(spanTitle);

      // select options
      const selectHistory = document.createElement('select');
      selectHistory.className = 'select-history';

      // set cookie for selected version of document
      selectHistory.addEventListener('change', () => {
        const version = selectHistory.options[selectHistory.selectedIndex].value;
        setCookie('api_version', version, { secure: true, 'max-age': 3600 });
      });

      optionData.forEach(i => {
        const option = document.createElement('option');
        option.value = i.id;
        option.innerText = i.version;
        selectHistory.appendChild(option);
      });
      divHistory.appendChild(selectHistory);

      // append container
      try {
        if (document.querySelector('.history') === null) {
          document.querySelector('.header-right').appendChild(divHistory);
          document.title = 'API Document';
          document.querySelector('.error-page').style.display = 'none';
        }
      } catch (e) {
        // do nothing
      }
    });
  });

  // configuration of the observer:
  const config = { attributes: true, childList: true, characterData: true };

  // pass in the target node, as well as the observer options
  observer.observe(target, config);
});

// function getCookie(name) {
//   const matches = document.cookie.match(new RegExp(
//     `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`,
//     // `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`,
//   ));
//   return matches ? decodeURIComponent(matches[1]) : undefined;
// }

function setCookie(name, value, options = {}) {
  const opts = {
    path: '/',
    ...options,
  };

  if (opts.expires instanceof Date) {
    opts.expires = opts.expires.toUTCString();
  }

  let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  for (const optionKey in opts) {
    if (optionKey !== '') {
      console.log('opt key!');
      console.log(optionKey);
      updatedCookie += `; ${optionKey}`;
      const optionValue = opts[optionKey];
      if (optionValue !== true) {
        updatedCookie += `=${optionValue}`;
      }
    }
  }

  document.cookie = updatedCookie;
}
