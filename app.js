(() => {
  const $ = id => document.querySelector(id);

  const $dropzone = $('#drop-zone');
  const $placeholder = $('#placeholder');

  const $preview = $('#preview');
  const context = $preview.getContext('2d');

  const $download = $('#download');
  const $options = $('#options');

  const logoPadding = 15;
  const logo = new Image();
  logo.src = 'brazzers-1.png';

  let imgsrc;
  let dx, dy, w, h;

  const $output = $('#output');
  const outputContext = $output.getContext('2d');


  const setCanvasDimensions = () => {
    const style = getComputedStyle($dropzone);
    $preview.width = parseInt(style.width);
    $preview.height = parseInt(style.height);
  }

  const commonHandler = event => {
    event.stopPropagation();
    event.preventDefault();
  };

  const loadImage = file => {
    const reader = new FileReader();

    reader.onload = () => {
      imgsrc = new Image();

      imgsrc.onload = () => {
        const ratio = imgsrc.width / imgsrc.height;

        w = $preview.width;
        h = w / ratio;

        if (h > $preview.height) {
          h = $preview.height;
          w = h * ratio;
        }

        context.clearRect(0, 0, $preview.width, $preview.height);

        dx = ($preview.width - w) / 2;
        dy = ($preview.height - h) / 2;
        context.drawImage(imgsrc, dx, dy, w, h);

        context.drawImage(
          logo,
          $preview.width - dx - logo.width - logoPadding,
          $preview.height - dy - logo.height - logoPadding
        );
      };

      imgsrc.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  $dropzone.addEventListener('dragover', event => {
    commonHandler(event);
    event.dataTransfer.dropEffect = 'copy';
    $dropzone.classList.add('on-drag');
  });

  $dropzone.addEventListener('drop', event => {
    commonHandler(event);
    $dropzone.classList.remove('on-drag');

    $placeholder.classList.add('hidden');

    $preview.classList.remove('hidden');
    $options.classList.remove('hidden');

    const file = event.dataTransfer.files[0];

    if (file && file.type.split('/')[0] === 'image') {
      loadImage(file);
    } else {
      alert('That is not an image!');
    }
  });

  $download.addEventListener('click', () => {
    console.log($preview.width, imgsrc.width, dx, $preview.height, imgsrc.height, dy);
    $output.width = w;
    $output.height = h;
    outputContext.drawImage($preview, dx, dy, w, h, 0, 0, w, h);
    $download.href = $output.toDataURL();
    $download.download = 'output.png';
  });

  setCanvasDimensions();
})();
