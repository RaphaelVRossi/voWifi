Generate Keystore

- keytool -genkey -v -keystore vowifi-key.keystore -alias vowifi-key -keyalg RSA -keysize 2048 -validity 10000

password: 
- Vvs@2018

Qual é o seu nome e o seu sobrenome?
  [Unknown]:  Rossi
Qual é o nome da sua unidade organizacional?
  [Unknown]:  engdb
Qual é o nome da sua empresa?
  [Unknown]:  engdb
Qual é o nome da sua Cidade ou Localidade?
  [Unknown]:  st andre
Qual é o nome do seu Estado ou Município?
  [Unknown]:  sp
Quais são as duas letras do código do país desta unidade?
  [Unknown]:  BR
CN=Rossi, OU=engdb, O=engdb, L=st andre, ST=sp, C=BR Está correto?
  [não]:  sim

Signer

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore vowifi-key.keystore /home/rapvieirar/desenv/projects/ionic/voWifi/platforms/android/build/outputs/apk/android-release-unsigned.apk vowifi-key


