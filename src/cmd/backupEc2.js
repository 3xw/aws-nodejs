exports.command = 'backupEc2 <volumeName>'

exports.describe = 'create fresh snapshot an deletes old if deleteDate is provided'

exports.builder = {
  deleteOldOnes:
  {
    default: true
  }
}

exports.handler = function (argv)
{
  // do something with argv.
  console.log(argv.volumeName);
}
