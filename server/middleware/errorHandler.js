// errorHandler.js

const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-undef
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }

  if (err.message === 'Invalid file type. Only PDF, Word, and image files are allowed.') {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }

  // إذا كانت هناك أخطاء أخرى
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};

module.exports = errorHandler;
