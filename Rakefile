# Artzilla Addon Builder 1.1
# http://artzilla.org - http://fffff.at
#
# If you don't have rake (ruby make) installed, type:
#   sudo gem install rake
#
# For easy uploading, specify a variable for your username and URL:
#
#  export ARTZILLA_HOST=you@yourwebsite.com
#  (put it in your ~/.bashrc)
#   or
#  ARTZILLA_HOST=you@yourwebsite.com rake deploy
#

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
  sh "git co content/google-alarm.js" # undo
  sh "rm -f google-alarm-nosound.xpi"
  sh "zip google-alarm-nosound.xpi -r chrome chrome.manifest content install.rdf"

  # TODO build Safari extension

  # Prep for deployment
  sh "cp -r *.user.js *.xpi safari/*.safariextz website/"
  puts "\n\nFirefox & Chrome extensions built.\n\n"
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
  if connection.nil? || connection == '' || !(connection =~ /^.+\@.+$/)
    raise "\n\nERROR: Need to specify ARTZILLA_HOST connection paramater 1st -- try:\n\n  export ARTZILLA_HOST=you@yourwebsite.com\n\n"
  end
  app = "googlealarm"
  sh "rsync -rtzh --progress website/* #{connection}:~/web/public/#{app}/"
  puts "\n\nWebsite deployed.\n\n"
end
