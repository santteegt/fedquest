 this.cFiles = new Meteor.Files({
  debug: true,
  collectionName: 'cFiles',
  allowClientCode: false, // Disallow remove files from Client
  storagePath:  '../../../../../Upload/Config' ,
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024*1024*10 && /json/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload file, with size equal or less than 10MB';
    }
  }
});



 if (Meteor.isServer) {
  cFiles.denyClient();
  Meteor.publish('files.cfiles.all', function () {
    return cFiles.find().cursor;
  });
}
