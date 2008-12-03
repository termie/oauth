#!/usr/bin/env python
#from distutils.core import setup
from setuptools import setup, find_packages

setup(name="oauth",
      version="1.0",
      description="Library for OAuth",
      author="Leah Culver",
      author_email="leah.culver@gmail.com",
      url="http://code.google.com/p/oauth",
      packages = find_packages(),
      zip_safe = True)
