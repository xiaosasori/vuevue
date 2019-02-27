<template>
    <v-alert type="error" dismissible transition="scale-transition" :value="true" tr>
        <h3>{{message}}</h3>
    </v-alert>
</template>

<script>
export default {
    props: ['message'],
}
</script>
