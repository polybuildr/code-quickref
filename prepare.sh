for i in pages/*.md; do echo -n "Building $i... "; node output-page.js $i; echo "Done"; done
echo -n "Copying visualizer... "
rm -rf public/vis; cp vis -r public/vis;
echo "Done."
for i in $(grep -ohE 'bower_components/[^"]*' vis/*.html); do echo $i; rsync -R $i public/; done
