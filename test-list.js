const fs = require('fs');

async function test() {
  const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
  const projectId = config.projectId;
  const dbId = config.firestoreDatabaseId || '(default)';
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/products`;
  
  const res = await fetch(url + '?pageSize=100');
  const text = await res.json();
  if (!text.documents) return console.log('no docs');
  for (let doc of text.documents) {
    console.log(doc.name.split('/').pop());
  }
}
test();
