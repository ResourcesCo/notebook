<template>
  <Nav>
    <TabArea>
      <Tab :selected="true">👁 Preview</Tab>
    </TabArea>
    <DisplayMenu />
  </Nav>
  <main class="m-1">
    <div>Here is the preview!</div>
    <router-link to="/app/side-nav-test" replace>Go to another page</router-link>
  </main>
</template>