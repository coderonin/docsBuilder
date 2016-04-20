# docsBuilder
Utility to create a documentation website from comments



Javadoc tags implemented:


| Tag & Parameter | Usage | Applies to |
| --- | --- | --- |
| @author John Smith| Describes an author.| Class, Interface, Enum |
| @version version| Provides software version entry. Max one per Class or Interface. | Class, Interface, Enum |
| @since since-text| Describes when this functionality has first existed. | Class, Interface, Enum, Field, Method |
| @see reference | Provides a link to other element of documentation. | Class, Interface, Enum, Field, Method |
| @param name description	Describes a method parameter. | Method |	
| @return description	Describes the return value. | Method |
| @exception classname description | Describes an exception that may be thrown from this method. | Method |
| @throws classname description | Describes an exception that may be thrown from this method. | Method |


Javadoc tags **to be** implemented:

|Tag & Parameter| Usage | Applies to |
| --- | --- | --- |
| @deprecated description | Describes an outdated method. | Class, Interface, Enum, Field, Method |
| {@inheritDoc} | Copies the description from the overridden method. | Overriding Method |
| {@link reference} | Link to other symbol. | Class, Interface, Enum, Field, Method |	
| {@value #STATIC_FIELD} | Return the value of a static field. | Static Field |
| {@code literal} | Formats literal text in the code font. It is equivalent to <code>{@literal}</code>. | Class, Interface, Enum, Field, Method |
| {@literal literal} | Denotes literal text. The enclosed text is interpreted as not containing HTML markup or nested javadoc tags. | Class, Interface, Enum, Field, Method |

XML tags to be supported

https://msdn.microsoft.com/en-us/library/5ast78ax.aspx

