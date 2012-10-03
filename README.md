sample usage:

<script type="text/javascript" src="/public/javascripts/jquery-1.8.1.min.js"></script>
    <script type="text/javascript" src="/public/javascripts/omh.js"></script>
    <script type="text/javascript">
      omh.init("https://dev.ohmage.org/app","OMH")
      omh.authenticate("USERNAME","PASSWORD",{
        success:function(){
          omh.read(
          "omh:ohmage:observer:com.openmhealth.ohmage.va.ptsd_explorer:appLaunched",
          "1",{success:function(res){
              console.log("read response",res)
            }})
        }
      })
    </script>