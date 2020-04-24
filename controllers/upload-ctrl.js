const fse = require('fs-extra')
const path = require("path")
const IncomingForm = require('formidable').IncomingForm

upload = (req, res) => {
  const user_id = req.params.user_id
  //const source = path.join(file.path)

  var form = new IncomingForm()

  form.parse(req)

  form.on('fileBegin', (field, file) => {
    console.log('fileBegin event')
    const target = path.join(__dirname, "..", "client/public/images", user_id + '-' + file.name)

    try {
      fse.removeSync(target)
      console.log('remove file!')
    } catch (err) {
      console.log('error removing file! - ', err)
    }

    file.path = target
  })

  form.on('file', (field, file) => {
    console.log('file event')
  })

  form.on('end', () => {
    //return res.json()
    console.log('File procesed and copied!')
    return res.status(201).json({
      success: true,
      message: 'File procesed and copied!',
    })
  })

}

module.exports = {
  upload,
}
