#
# Artzilla Browser Builder 1.1
#
# If you don't have rake (ruby make) installed, type:
#   sudo gem install rake
#
# Specify the destination for the website:
#  export ARTZILLA_HOST=you@yourwebsite.com
#  (put it in your ~/.bashrc)
#   or
#  ARTZILLA_HOST=you@yourwebsite.com rake deploy

task :default => :build

desc "Build add-on XPI"
task :build do

  # Normal version
  sh "rm -f google-alarm.xpi"
  sh "zip google-alarm.xpi -r chrome chrome.manifest content install.rdf"
  sh "cp content/google-alarm.js google-alarm.user.js"

  # Nosound version
  sh "cp content/google-alarm.js google-alarm-nosound.user.js"
  sh "cat content/google-alarm.js | sed 's/soundEnabled = true/soundEnabled = false/' > google-alarm-nosound.user.js"
  sh 'cp "google-alarm-nosound.user.js" "content/google-alarm.js"'
  sh "echo lolwut"
  sh "rm -f google-alarm-nosound.xpi"
  sh "zip google-alarm-nosound.xpi -r chrome chrome.manifest content install.rdf"

  # TODO build Safari extension

  # Prep for deployment
  sh "cp -r *.user.js *.xpi safari/*.safariextz website/"
  puts "Firefox & Chrome extensions built."
end

desc "Build & open the XPI w/ Firefox (Mac)"
task :install => :build do
  sh "open -a Firefox google-alarm.xpi"
end

desc "Build & deploy website"
task :deploy => :build do
  # TODO prompt for release information & replace in website
  # TODO read app name from current directory?
  connection = ENV['ARTZILLA_HOST']
  raise "Need to specify ARTZILLA_HOST connection paramater 1st -- try 'export ARTZILLA_HOST=\"you@artzilla.org\"'"
  app = "googlealarm"
  sh "rsync -rtzh --progress website/* #{connection}:~/web/public/#{app}/"
end
