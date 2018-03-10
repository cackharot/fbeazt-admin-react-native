#!/bin/bash
pushd android
    export ENVFILE=.env.prod
    ./gradlew assembleRelease
popd
