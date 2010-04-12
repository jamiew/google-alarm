# Google Alarm mgmnt via rake
# Adopted from Scott Kyle's Rakefile
# http://github.com/appden/appden.github.com/blob/master/Rakefile

task :default => :build
 
desc 'Build site'
task :build do
  sh 'rm -f googlealarm.xpi'
  sh "zip googlealarm.xpi -r chrome content install.rdf" # works on linux + mac
end

task :install => :build do
  sh 'open -a Firefox googlealarm.xpi' # Mac-oriented
end
 
desc 'Build & deploy'
task :deploy => :build do
  # sh 'rsync -rtzh --progress --delete . fffffat@fffff.at:~/fffff.at/google-alarm/'
  sh 'rsync -rtzh --progress files fffffat@fffff.at:~/fffff.at/files/google-alarm/'
  sh 'rsync -rtzh --progress *.js *.xpi fffffat@fffff.at:~/fffff.at/files/'
  #TODO: do something with the XPI as well
end

