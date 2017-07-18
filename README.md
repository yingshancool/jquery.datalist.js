# jquery.datalist.js


how to use?



## step1:
include jquery and jquery.datalist.js and style.
```
<link rel="stylesheet" href="./style.css">
```
```
<script type="text/javascript" src="./jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="./jquery.datalist.js"></script>
```

## step2
create a select list on body and give it classname.

the select name can be use for from commit!

like that:
```
<select class="datalist" name="classmate">
	<option>jone</option>
	<option>jack</option>
	<option>phili</option>
	<option>cool</option>
</select>
```

## step3
select ul of step2 give classname and option the plugin. 
```
$(".datalist").datalist({
    width   : '300px',
    default : '__FIRST__'
});
```

option:
- width: the select and datalist width.  etc. 100% \ 250px ......
- default: the select show a value when the select init, if use first value just write '__FIRST__', other value direct be use.
- 


------
license MIT.
