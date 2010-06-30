# Google Alarm

task :default => :build

desc "Build add-on XPI"
task :build do
  sh "rm -f google-alarm.xpi"
  sh "zip google-alarm.xpi -r chrome chrome.manifest content install.rdf"
end

desc "Build & open the XPI w/ Firefox (Mac-oriented)"
task :install => :build do
  sh "open -a Firefox google-alarm.xpi"
end

desc "Build & deploy files to fffff.at"
task :deploy => :build do
  sh "rsync -rtzh --progress files fffffat@fffff.at:~/fffff.at/google-alarm/files"
  sh "rsync -rtzh --progress *.js *.xpi fffffat@fffff.at:~/fffff.at/google-alarm/"
end
