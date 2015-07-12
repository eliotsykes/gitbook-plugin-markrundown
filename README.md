# Markrundown

> Runnable markdown documents, with superpowers for technical authors who specialize writing programming tutorials and gitorials. Your book executes the same steps your readers will, including shell commands, writing code, committing to a git repo, and preparing associated distributables (e.g. zipped git repos).

Markrundown allows you to write markdown that takes advantage of your coding skills to make writing a  book less repetitive and more like programming. 

This is good for technical books that must be maintained over time to incorporate ongoing changes of the book's dependencies (e.g. library and API changes).

Markrundown documents&hellip;

- are valid markdown 
- are plain text
- build ebooks (epub, mobi, pdf) thanks to [gitbook](https://github.com/GitbookIO/gitbook)
- allow you to maintain a book's associated codebase from one source of truth
- can run scripts 
- can write code
- can apply patches
- can build git repos from scratch
- screengrab any URL and insert it in your book
- update screengrab images from any URL
- zip up folders for distribution with your book
- can do anything else you can code

Currently Markrundown requires use with [gitbook](https://github.com/GitbookIO/gitbook) (although the syntax can be adapted to be used in other markdown parsing applications).

## Installation

1. Create a [gitbook](https://github.com/GitbookIO/gitbook)
2. Install the eliotsykes/gitbook-plugin-markdown github repo as a node module with npm
3. In the gitbook's `book.json`, add the `"markrundown"` plugin in the `"plugins"` option:

```json
  "plugins": [ "markrundown" ]
```

## Usage

To inline a bash script you want to run, use the `run` keyword after the language on the opening fence:

<pre>
```bash run
mkdir hello-world
cd hello-world
git init .
git add .
git commit -m "Initial commit of app used in your book"
```
</pre>

To apply a patch to the book's codebase, use the `patch` as the language on the opening fence line:

<pre>
```patch
--- a/hello-world/config/routes.rb
+++ b/hello-world/config/routes.rb
@@ -1,9 +1,5 @@
 Rails.application.routes.draw do
-  # The priority is based upon order of creation: first created -> highest priority.
-  # See how all your routes lay out with "rake routes".
-
-  # You can have the root of your site routed with "root"
-  # root 'welcome#index'
+  root 'welcome#index'
 
   # Example of regular route:
   #   get 'products/:id' => 'catalog#view'
```
</pre>

If you're book is a step-by-step walkthrough of code changes that the reader should make, you can use a combination of `patch` and `run` code blocks to perform and verify the same steps.

Here are some ideas to get you started:

- Use a `bash run` block to run the current test suite
- Use `patch` blocks throughout to make the code changes you want your reader to make to their app codebase
- Use `bash run` blocks regularly to `git commit -m '...'` the changes made by most recent `patch`(es) 
- Zip your book's codebase with a `bash run` block


## Updating your book

If a library your book depends on changes, you will make any needed changes in the `patch` and `bash run` blocks in the markrundown document. You then simply rebuild the book and its associated codebase from scratch by running `gitbook build`.

