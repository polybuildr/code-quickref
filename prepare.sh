for i in pages/*.md; do echo $i; node output-page.js $i; done
# no bower_components right now
# for i in $(grep -oE 'bower_components/[^"]*' public/*.html); do echo $i; done
